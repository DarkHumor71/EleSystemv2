// actions/auth.ts
export interface RegisterApartmentParams {
  building: string;
  pin: string;
  is_moderator: boolean;
}

export interface RegisterBuildingParams {
  name: string;
  email: string;
  address: string;
  state: string;
  city: string;
  password?: string | null;
  pin: string;
  firstName: string;
  lastName: string;
  apartmentNumber: string;
  apartmentEmail: string;
}

// actions/apartment.ts
export interface ApartmentData {
  [key: string]: any;
}

export interface ApartmentResponse {
  work: boolean;
  id?: string;
}

// components/StatBox.tsx
type StatBoxProps = {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  isProgress?: boolean;
  progress?: number;
  increase: string;
};

// components/routing/privateroute.tsx
type AuthState = {
  isAuthenticated: boolean;
  loading: boolean;
  isResident: boolean;
  isModerator: boolean;
  is_admin: boolean;
};

type PrivateRouteProps = {
  auth: AuthState;
  children: React.ReactNode;
};

// components/ProgressCircle.tsx
type ProgressCircleProps = {
  progress?: number;
  size?: number;
};

// components/LineChart.tsx
type ExpenseEntry = {
  apartment_number: string;
  createdAt: string;
  cost: number | string;
};

type LineChartProps = {
  isCustomLineColors?: boolean;
  isDashboard?: boolean;
  data?: ExpenseEntry[];
};

type ChartDatum = {
  x: string;
  y: number;
};

type ChartSerie = {
  id: string;
  data: ChartDatum[];
};

// components/Header.tsx
type HeaderProps = {
  title: string;
  subtitle: string;
};

// Layout/MainLayout.tsx
type MainLayoutProps = {
  side?: boolean;
  profile?: boolean;
};

// Layout/Alert.tsx
type AlertType = {
  id: string;
  msg: string;
  alertType: string;
};

type AlertProps = {
  alerts?: AlertType[];
};

// pages/profile.tsx
interface ProfileProps {
  setAlert: (msg: string, type: string) => void;
  id: string;
  email: string;
  lastName: string;
  firstName: string;
  buildingName: string;
  address: string;
  state: string;
  city: string;
  pin: string;
}

// pages/login.tsx
interface LoginProps {
  setAlert: (msg: string, type: string) => void;
  loadApartment: () => Promise<void>;
  loginBuilding: (email: string) => Promise<{ exists?: boolean } | undefined>;
  loginApartment: (
    pin: string,
    email?: string
  ) => Promise<
    false | { work?: boolean; admin?: boolean; mod?: boolean } | undefined
  >;
  isAuthenticated?: boolean;
  isModerator?: boolean;
  isResident?: boolean;
}

// pages/list_of_building.tsx
type BuildingRow = {
  id?: string;
  email?: string;
  [key: string]: any;
};

type BuildingsProps = {
  head?: boolean;
  buildingRes?: () => Promise<BuildingRow[]>;
  inheritedDeps?: any[];
};

// pages/global/Topbar.tsx
interface TopbarProps {
  profile?: boolean;
  logout: () => void;
  setIsSidebar?: React.Dispatch<React.SetStateAction<boolean>>;
}

// pages/global/Sidebar.tsx
interface ItemProps {
  title: string;
  to: string;
  icon: React.ReactNode;
  selected: string;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
}

interface SidebarProps {
  isSidebar?: boolean;
}

// pages/form/qrcode.tsx
interface QRCodeComponentProps {
  id?: string | null;
  download?: boolean;
  print?: boolean;
  send?: boolean;
}

// pages/form/createbuilding.tsx
interface BuildingFormValues {
  name: string;
  email: string;
  address: string;
  state: string;
  city: string;
  pin: string;
  firstName: string;
  lastName: string;
  apartmentNumber: string;
  apartmentEmail: string;
}

interface BuildingRegisterProps {
  setAlert: (msg: string, type: string) => void;
  registerBuilding: (
    values: BuildingFormValues
  ) => Promise<false | { work?: boolean; apartment_id?: string }>;
}

// pages/form/createapartment.tsx
interface ApartmentFormValues {
  first_name: string;
  last_name: string;
  email: string;
  apartment_number: string | number;
  pin: string;
  is_moderator: boolean;
}

interface CreateApartmentProps {
  setAlert: (msg: string, type: string) => void;
  building_id?: string | null;
  isloading: boolean;
  registerApartment: (
    payload: ApartmentFormValues & { building: string | null }
  ) => Promise<{ work?: boolean; id?: string } | undefined>;
}

// pages/dashboard/mod.tsx
interface ModProps {
  isloading?: boolean;
  building_id?: string;
  fetchBuildingExpense: (building_id: string) => Promise<any[]>;
  fetchApartments: (building_id: string) => Promise<any[]>;
  deleteApartment: (email: string) => Promise<void>;
}

// pages/dashboard/apart.tsx
interface AprProps {
  isloading?: boolean;
  apartment_id?: string | null;
  fetchApartmentExpenses: (apartment_id: string) => Promise<any[]>;
}

// pages/dashboard/admin.tsx
interface AdminDashboardProps {
  deleteBuilding: (email: string) => Promise<void>;
  buildingRes: () => Promise<any[]>;
  apartmentRes: () => Promise<any[]>;
}

// pages/building_expenses.tsx
interface ExpensesProps {
  building_id?: string;
  isloading: boolean;
  fetchBuildingExpense: (building_id: string) => Promise<any[]>;
  fetchApartmentExpenses: (apartment_id: string) => Promise<any[]>;
  apartment_id?: string;
  single?: boolean;
}

// pages/building.tsx
type BuildingRow = {
  id?: string;
  apartment_number?: string;
  [key: string]: any;
};

type BuildingsProps = {
  head?: boolean;
};

// pages/apartments.tsx
type ApartmentRow = {
  id?: string;
  apartment_number?: string;
  [key: string]: any;
};

type ApartmentsProps = {
  building_id?: string | null;
  isloading: boolean;
  fetchApartments: (building_id: string) => Promise<ApartmentRow[]>;
};

// reducers/auth.ts
export type AuthState = {
  token: string | null;
  isAuthenticated: boolean | null;
  isResident: boolean;
  isModerator: boolean;
  is_admin?: boolean;
  loading: boolean;
  apartment: any;
  building: any;
  showPinField?: boolean;
  status?: string;
  message?: string;
};

export type AuthAction = {
  type: string;
  payload?: any;
};

// reducers/apartment.ts
export type Apartment = {
  id?: string;
  [key: string]: any;
};

export type ApartmentAction = {
  type: string;
  payload?: any;
};

// reducers/alert.ts
export type Alert = {
  id: string;
  msg: string;
  alertType: string;
};

export type AlertAction =
  | { type: typeof SET_ALERT; payload: Alert }
  | { type: typeof REMOVE_ALERT; payload: string };
