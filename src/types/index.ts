export type ThemeMode = 'dark' | 'light' | 'system';
export type MotionIntensity = 'off' | 'low' | 'medium' | 'high';
export type ParallaxIntensity = 'off' | 'subtle' | 'balanced' | 'strong';
export type AnimationSpeed = 'slow' | 'normal' | 'fast';
export type CursorEffects = 'disabled' | 'minimal' | 'full';

export interface MotionSettings {
  theme: ThemeMode;
  motionIntensity: MotionIntensity;
  parallaxIntensity: ParallaxIntensity;
  animationSpeed: AnimationSpeed;
  cursorEffects: CursorEffects;
  reducedMotion: boolean;
  disableFloatingElements: boolean;
  disableHoverMovement: boolean;
  simplifiedVisualEffects: boolean;
  soundEnabled: boolean;
  logoStyle?: 'monolith' | 'crucible' | 'prism';
}

export type ProjectCategory = 
  | 'all'
  | 'branding'
  | 'logos'
  | 'posters'
  | 'magazines'
  | 'websites'
  | 'social'
  | 'packaging';

export interface Project {
  id: string;
  title: string;
  category: Exclude<ProjectCategory, 'all'>;
  categoryLabel: string;
  year: string;
  client: string;
  challenge: string;
  concept: string;
  outcome: string;
  deliverables: string[];
  imageUrl: string;
  aspect?: 'portrait' | 'landscape' | 'square';
  featured?: boolean;
}

export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  deliverableHighlights: string[];
  disciplineTag: string;
}

export interface InquiryData {
  id?: string;
  name: string;
  email: string;
  company: string;
  service: string;
  description: string;
  budget: string;
  deadline: string;
  referenceLinks?: string;
  attachmentsNote?: string;
  recipientEmail?: string;
  deliveryStatus?: string;
  createdAt?: string;
  status?: 'new' | 'reviewed' | 'contacted';
}

