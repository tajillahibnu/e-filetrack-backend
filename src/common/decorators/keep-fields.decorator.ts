import { SetMetadata } from '@nestjs/common';

export const KeepFields = (...fields: string[]) =>
  SetMetadata('fieldsToKeep', fields);
