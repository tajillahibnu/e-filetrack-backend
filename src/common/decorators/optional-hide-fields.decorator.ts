import { SetMetadata } from '@nestjs/common';

export const OptionalHideFields = (...fields: string[]) =>
  SetMetadata('fieldsToOptionalHide', fields);
