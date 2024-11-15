// API endpoints and types for vehicle data
export interface PlateSearchResponse {
  vehicleId: string;
  brand: string;
  model: string;
  engine: string;
  year: number;
  notes: string | null;
  vehicleType: string;
}

export async function searchByPlate(plate: string): Promise<PlateSearchResponse> {
  const response = await fetch(`http://plate-information.159.69.86.229.sslip.io/plate/${plate}`);
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Vehicle not found with the provided plate number');
    }
    throw new Error('Failed to fetch vehicle information');
  }
  return response.json();
}

export async function fetchBrands(): Promise<Array<{value: string, label: string}>> {
  // TODO: Replace with actual API endpoint
  const brands = ['KIA MOTORS', 'TOYOTA', 'HYUNDAI', 'CHEVROLET'].map(brand => ({
    value: brand,
    label: brand
  }));
  return Promise.resolve(brands);
}

export async function fetchModels(brand: string): Promise<Array<{value: string, label: string}>> {
  // TODO: Replace with actual API endpoint
  const modelsByBrand: { [key: string]: string[] } = {
    'KIA MOTORS': ['MORNING', 'RIO', 'SPORTAGE', 'CERATO'],
    'TOYOTA': ['YARIS', 'COROLLA', 'RAV4', 'HILUX'],
    'HYUNDAI': ['ACCENT', 'ELANTRA', 'TUCSON', 'SANTA FE'],
    'CHEVROLET': ['SPARK', 'SAIL', 'CAPTIVA', 'COLORADO']
  };
  
  const models = (modelsByBrand[brand] || []).map(model => ({
    value: model,
    label: model
  }));
  
  return Promise.resolve(models);
}

export async function fetchVersions(brand: string, model: string): Promise<Array<{value: string, label: string}>> {
  // TODO: Replace with actual API endpoint
  const versions = ['Base', 'Mid', 'Full'].map(version => ({
    value: version,
    label: version
  }));
  
  return Promise.resolve(versions);
}
