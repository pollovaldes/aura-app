export type GaleryImage = {
  uri: string | null;
  fileName: string | null;
};

export type Vehicle = {
  id: string;
  brand: string;
  sub_brand: string;
  year: number;
  plate: string;
  serial_number: string;
  economic_number: string;
  thumbnail: string | null;
  galery: GaleryImage[];
  gasoline_threshold: number;
};
