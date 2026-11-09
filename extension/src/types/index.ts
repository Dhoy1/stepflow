export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ViewportMeta {
  width: number;
  height: number;
  scrollX: number;
  scrollY: number;
  devicePixelRatio: number;
}

export interface TargetElementMeta {
  tagName: string;
  id?: string;
  className?: string;
  innerText?: string;
  placeholder?: string;
  ariaLabel?: string;
  selector?: string;
  rect: BoundingBox;
  viewport: ViewportMeta;
  inputValue?: string;
  selectedText?: string;
  isDropdownOption?: boolean;
  isDropdownTrigger?: boolean;
}

export interface BlurRegion extends BoundingBox {
  id: string;
}

export interface HighlightConfig extends BoundingBox {
  id?: string;
  color: string;
  style: 'border' | 'spotlight' | 'dot';
}

export interface NumberBadge {
  id: string;
  x: number;
  y: number;
  number: number;
  color?: string;
  size?: number;
}

export interface StepCallout {
  type: 'tip' | 'warning' | 'info' | 'none';
  text: string;
}

export interface ArrowAnnotation {
  id: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  color?: string;
}

export interface Step {
  id: string;
  order: number;
  actionType: 'click' | 'input' | 'change' | 'select' | 'navigation' | 'manual' | string;
  title: string;
  description: string;
  url: string;
  pageTitle: string;
  targetElement?: TargetElementMeta;
  screenshot: string; // Base64 data URI of the captured tab
  originalScreenshot?: string; // Backup of uncropped original screenshot
  annotatedScreenshot?: string; // Processed screenshot with spotlight / blur / box
  highlight?: HighlightConfig;
  highlights?: HighlightConfig[];
  numberBadges?: NumberBadge[];
  blurRegions?: BlurRegion[];
  arrows?: ArrowAnnotation[];
  callout?: StepCallout;
}

export interface WorkflowEditLog {
  id?: number;
  workflowId?: string;
  editorName: string;
  editedAt: number;
}

export interface Workflow {
  id: string;
  title: string;
  description: string;
  category?: string;
  createdAt: number;
  updatedAt: number;
  targetUrl: string;
  steps: Step[];
  author?: string;
  lastEditedBy?: string;
  editLogs?: WorkflowEditLog[];
  companyName?: string;
  logoUrl?: string;
}

export type RecordingStatus = 'idle' | 'recording' | 'paused';

export interface ExtensionMessage {
  type:
    | 'START_RECORDING'
    | 'PAUSE_RECORDING'
    | 'RESUME_RECORDING'
    | 'STOP_RECORDING'
    | 'DISCARD_RECORDING'
    | 'GET_STATUS'
    | 'RECORDING_STATUS_CHANGED'
    | 'PRE_CAPTURE'
    | 'CAPTURE_STEP'
    | 'STEP_CAPTURED'
    | 'OPEN_EDITOR'
    | 'GET_WORKFLOW'
    | 'WORKFLOW_UPDATED';
  payload?: any;
}

