export type GaleriaImage = {
  uri: string;
  fileName: string;
};

export type Truck = {
  id: string;
  brand: string;
  sub_brand: string;
  year: number;
  plate: string;
  serial_number: string;
  economic_number: string;
  fotoPerfil: string | undefined | null;
  galeria: GaleriaImage[];
};