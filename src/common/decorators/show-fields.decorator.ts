import { SetMetadata } from '@nestjs/common';

export const ShowFields = (...fields: string[]) =>
  SetMetadata('fieldsToShow', fields);
