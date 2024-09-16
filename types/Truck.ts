export type GaleryImage = {
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
  thumbnail: string | null;
  galery: GaleryImage[];
};
