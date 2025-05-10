export interface GHLContact {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  businessName?: string;
  type?: string;
  source?: string;
  tags?: string[];
  customField?: {
    id: string;
    value: string;
  }[];
  address1?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  website?: string;
  timezone?: string;
  locationId?: string;
  dnd?: boolean;
} 