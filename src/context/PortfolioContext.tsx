import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { 
  User, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where 
} from 'firebase/firestore';
import { 
  auth, 
  db, 
  googleProvider, 
  signInWithPopup, 
  signOut, 
  handleFirestoreError, 
  OperationType 
} from '../firebase';
import { SiteProfile, Project, ProjectImage, TimelineItem, SkillItem } from '../types';
import { 
  DEFAULT_PROFILE, 
  DEFAULT_PROJECTS, 
  DEFAULT_TIMELINE, 
  DEFAULT_SKILLS 
} from '../initialData';

interface PortfolioContextType {
  // Auth state
  currentUser: User | null;
  isAdmin: boolean;
  isAuthReady: boolean;
  loginWithGoogle: () => Promise<void>;
  logoutUser: () => Promise<void>;

  // Data state
  isLoading: boolean;
  profile: SiteProfile;
  projects: Project[];
  timeline: TimelineItem[];
  skills: SkillItem[];
  
  // Profile Actions
  saveProfile: (newProfile: SiteProfile) => Promise<void>;

  // Project Actions
  saveProject: (project: Omit<Project, 'id'> & { id?: string }) => Promise<string>;
  removeProject: (projectId: string) => Promise<void>;
  swapProjectOrder: (projectId1: string, projectId2: string) => Promise<void>;

  // Project Images Actions
  fetchProjectImages: (projectId: string) => Promise<ProjectImage[]>;
  saveProjectImage: (projectId: string, imageUrl: string, caption?: string) => Promise<void>;
  removeProjectImage: (imageId: string) => Promise<void>;

  // Timeline Actions
  saveTimelineItem: (item: Omit<TimelineItem, 'id'> & { id?: string }) => Promise<void>;
  removeTimelineItem: (itemId: string) => Promise<void>;
  swapTimelineOrder: (itemId1: string, itemId2: string) => Promise<void>;

  // Skill Actions
  saveSkillItem: (skill: Omit<SkillItem, 'id'> & { id?: string }) => Promise<void>;
  removeSkillItem: (skillId: string) => Promise<void>;

  // Reset or Seed
  seedDefaultDataToFirestore: () => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType | null>(null);

const ADMIN_EMAIL = 'jimmybaijun@gmail.com';

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [profile, setProfile] = useState<SiteProfile>(DEFAULT_PROFILE);
  const [projects, setProjects] = useState<Project[]>(DEFAULT_PROJECTS);
  const [timeline, setTimeline] = useState<TimelineItem[]>(DEFAULT_TIMELINE);
  const [skills, setSkills] = useState<SkillItem[]>(DEFAULT_SKILLS);

  const isAdmin = useMemo(() => {
    if (!currentUser) return false;
    const email = currentUser.email?.toLowerCase().trim();
    return email === ADMIN_EMAIL.toLowerCase().trim();
  }, [currentUser]);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  // Listen to Firestore Profile
  useEffect(() => {
    const profileDocRef = doc(db, 'siteProfile', 'main');
    const unsubscribe = onSnapshot(
      profileDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setProfile(docSnap.data() as SiteProfile);
        } else {
          // If Firestore is empty, use DEFAULT_PROFILE
          setProfile(DEFAULT_PROFILE);
        }
      },
      (error) => {
        console.warn('Firestore profile snapshot error, using default data:', error);
        handleFirestoreError(error, OperationType.GET, 'siteProfile/main');
      }
    );
    return () => unsubscribe();
  }, []);

  // Listen to Projects
  useEffect(() => {
    const projectsCol = collection(db, 'projects');
    const q = query(projectsCol, orderBy('order', 'asc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: Project[] = [];
          snapshot.forEach((doc) => {
            list.push({ id: doc.id, ...doc.data() } as Project);
          });
          setProjects(list);
        } else {
          setProjects(DEFAULT_PROJECTS);
        }
        setIsLoading(false);
      },
      (error) => {
        console.warn('Firestore projects snapshot error, using default projects:', error);
        setProjects(DEFAULT_PROJECTS);
        setIsLoading(false);
        handleFirestoreError(error, OperationType.LIST, 'projects');
      }
    );
    return () => unsubscribe();
  }, []);

  // Listen to Timeline
  useEffect(() => {
    const timelineCol = collection(db, 'timeline');
    const q = query(timelineCol, orderBy('order', 'asc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: TimelineItem[] = [];
          snapshot.forEach((doc) => {
            list.push({ id: doc.id, ...doc.data() } as TimelineItem);
          });
          setTimeline(list);
        } else {
          setTimeline(DEFAULT_TIMELINE);
        }
      },
      (error) => {
        console.warn('Firestore timeline snapshot error, using default timeline:', error);
        setTimeline(DEFAULT_TIMELINE);
        handleFirestoreError(error, OperationType.LIST, 'timeline');
      }
    );
    return () => unsubscribe();
  }, []);

  // Listen to Skills
  useEffect(() => {
    const skillsCol = collection(db, 'skills');
    const q = query(skillsCol, orderBy('order', 'asc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: SkillItem[] = [];
          snapshot.forEach((doc) => {
            list.push({ id: doc.id, ...doc.data() } as SkillItem);
          });
          setSkills(list);
        } else {
          setSkills(DEFAULT_SKILLS);
        }
      },
      (error) => {
        console.warn('Firestore skills snapshot error, using default skills:', error);
        setSkills(DEFAULT_SKILLS);
        handleFirestoreError(error, OperationType.LIST, 'skills');
      }
    );
    return () => unsubscribe();
  }, []);

  // Login
  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: unknown) {
      console.error('Google Sign-In Error:', err);
      throw err;
    }
  };

  // Logout
  const logoutUser = async () => {
    try {
      await signOut(auth);
    } catch (err: unknown) {
      console.error('Sign Out Error:', err);
      throw err;
    }
  };

  // Save Profile
  const saveProfile = async (newProfile: SiteProfile) => {
    try {
      const path = 'siteProfile/main';
      const cleanData: SiteProfile = {
        name: newProfile.name.trim(),
        school: newProfile.school.trim(),
        grade: newProfile.grade.trim(),
        tagline: newProfile.tagline.trim(),
        aboutMe: newProfile.aboutMe.trim(),
        learningFocus: newProfile.learningFocus.trim(),
        currentLearning: newProfile.currentLearning.trim(),
        futureGoals: newProfile.futureGoals.trim(),
        avatarUrl: newProfile.avatarUrl || DEFAULT_PROFILE.avatarUrl,
        adminEmail: ADMIN_EMAIL,
        updatedAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'siteProfile', 'main'), cleanData, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'siteProfile/main');
    }
  };

  // Save Project (Create or Update)
  const saveProject = async (proj: Omit<Project, 'id'> & { id?: string }): Promise<string> => {
    const id = proj.id && !proj.id.startsWith('sample-') 
      ? proj.id 
      : 'p_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
    
    try {
      const path = `projects/${id}`;
      const dataToSave = {
        title: proj.title.trim(),
        date: proj.date.trim(),
        category: proj.category.trim(),
        summary: proj.summary.trim(),
        content: proj.content.trim(),
        challenge: proj.challenge.trim(),
        solution: proj.solution.trim(),
        reflection: proj.reflection.trim(),
        coverImage: proj.coverImage || '',
        videoUrl: proj.videoUrl?.trim() || '',
        order: Number(proj.order) || projects.length + 1,
        updatedAt: new Date().toISOString(),
        createdAt: proj.createdAt || new Date().toISOString(),
      };
      await setDoc(doc(db, 'projects', id), dataToSave);
      return id;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `projects/${id}`);
    }
  };

  // Remove Project
  const removeProject = async (projectId: string) => {
    try {
      await deleteDoc(doc(db, 'projects', projectId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `projects/${projectId}`);
    }
  };

  // Swap Project Order
  const swapProjectOrder = async (projectId1: string, projectId2: string) => {
    const p1 = projects.find(p => p.id === projectId1);
    const p2 = projects.find(p => p.id === projectId2);
    if (!p1 || !p2) return;

    try {
      await setDoc(doc(db, 'projects', p1.id), { ...p1, order: p2.order }, { merge: true });
      await setDoc(doc(db, 'projects', p2.id), { ...p2, order: p1.order }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'projects');
    }
  };

  // Fetch Project Additional Images
  const fetchProjectImages = async (projectId: string): Promise<ProjectImage[]> => {
    return new Promise((resolve) => {
      const q = query(
        collection(db, 'projectImages'),
        where('projectId', '==', projectId)
      );
      onSnapshot(
        q,
        (snapshot) => {
          const imgs: ProjectImage[] = [];
          snapshot.forEach((doc) => {
            imgs.push({ id: doc.id, ...doc.data() } as ProjectImage);
          });
          imgs.sort((a, b) => a.order - b.order);
          resolve(imgs);
        },
        (error) => {
          console.warn('Failed to fetch project images:', error);
          resolve([]);
        }
      );
    });
  };

  // Save Project Image
  const saveProjectImage = async (projectId: string, imageUrl: string, caption?: string) => {
    const id = 'img_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
    try {
      const data = {
        projectId,
        imageUrl,
        caption: caption?.trim() || '',
        order: Date.now(),
        createdAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'projectImages', id), data);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `projectImages/${id}`);
    }
  };

  // Remove Project Image
  const removeProjectImage = async (imageId: string) => {
    try {
      await deleteDoc(doc(db, 'projectImages', imageId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `projectImages/${imageId}`);
    }
  };

  // Save Timeline Item
  const saveTimelineItem = async (item: Omit<TimelineItem, 'id'> & { id?: string }) => {
    const id = item.id && !item.id.startsWith('tl-')
      ? item.id
      : 'tl_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);

    try {
      const data = {
        year: item.year.trim(),
        title: item.title.trim(),
        description: item.description.trim(),
        category: item.category.trim(),
        order: Number(item.order) || timeline.length + 1,
        createdAt: item.createdAt || new Date().toISOString(),
      };
      await setDoc(doc(db, 'timeline', id), data);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `timeline/${id}`);
    }
  };

  // Remove Timeline Item
  const removeTimelineItem = async (itemId: string) => {
    try {
      await deleteDoc(doc(db, 'timeline', itemId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `timeline/${itemId}`);
    }
  };

  // Swap Timeline Order
  const swapTimelineOrder = async (itemId1: string, itemId2: string) => {
    const t1 = timeline.find(t => t.id === itemId1);
    const t2 = timeline.find(t => t.id === itemId2);
    if (!t1 || !t2) return;

    try {
      await setDoc(doc(db, 'timeline', t1.id), { ...t1, order: t2.order }, { merge: true });
      await setDoc(doc(db, 'timeline', t2.id), { ...t2, order: t1.order }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'timeline');
    }
  };

  // Save Skill Item
  const saveSkillItem = async (skill: Omit<SkillItem, 'id'> & { id?: string }) => {
    const id = skill.id && !skill.id.startsWith('sk-')
      ? skill.id
      : 'sk_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);

    try {
      const data = {
        name: skill.name.trim(),
        category: skill.category.trim() || '其他技能',
        order: Number(skill.order) || skills.length + 1,
        createdAt: skill.createdAt || new Date().toISOString(),
      };
      await setDoc(doc(db, 'skills', id), data);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `skills/${id}`);
    }
  };

  // Remove Skill Item
  const removeSkillItem = async (skillId: string) => {
    try {
      await deleteDoc(doc(db, 'skills', skillId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `skills/${skillId}`);
    }
  };

  // Seed sample data to Firestore if admin wants to initialize
  const seedDefaultDataToFirestore = async () => {
    try {
      await saveProfile(DEFAULT_PROFILE);
      for (const p of DEFAULT_PROJECTS) {
        await saveProject(p);
      }
      for (const t of DEFAULT_TIMELINE) {
        await saveTimelineItem(t);
      }
      for (const s of DEFAULT_SKILLS) {
        await saveSkillItem(s);
      }
    } catch (error) {
      console.error('Seed data error:', error);
    }
  };

  return (
    <PortfolioContext.Provider
      value={{
        currentUser,
        isAdmin,
        isAuthReady,
        loginWithGoogle,
        logoutUser,
        isLoading,
        profile,
        projects,
        timeline,
        skills,
        saveProfile,
        saveProject,
        removeProject,
        swapProjectOrder,
        fetchProjectImages,
        saveProjectImage,
        removeProjectImage,
        saveTimelineItem,
        removeTimelineItem,
        swapTimelineOrder,
        saveSkillItem,
        removeSkillItem,
        seedDefaultDataToFirestore,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
