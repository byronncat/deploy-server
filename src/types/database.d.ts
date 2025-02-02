export type PostgreSQL = {
  none: Function;
  one: Function;
  oneOrNone: Function;
  many: Function;
  manyOrNone: Function;
  any: Function;
  connect: Function;
};

export type Cloudinary = {
  upload: Function;
  destroy: Function;
};

export interface CloudinaryUploadResponse {
  public_id?: string;
  url?: string;
  secure_url: string;
  width: number;
  height: number;
}

export interface CloudinaryDestroyResponse {
  result?: 'ok' | 'not found' | 'error';
}
