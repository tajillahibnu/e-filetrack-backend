import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { map } from 'rxjs/operators';

@Injectable()
export class ExcludeFieldsInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    // ✅ Default field yang selalu disembunyikan
    const defaultHiddenFields = ['createdAt', 'updatedAt', 'deletedAt'];

    // ✅ Ambil field yang boleh muncul (ShowFields)
    const fieldsFromClass =
      this.reflector.get<string[]>('fieldsToShow', context.getClass()) || [];
    const fieldsFromMethod =
      this.reflector.get<string[]>('fieldsToShow', context.getHandler()) || [];

    // ✅ Ambil field yang harus tetap ada (KeepFields)
    const keepFieldsFromClass =
      this.reflector.get<string[]>('fieldsToKeep', context.getClass()) || [];
    const keepFieldsFromMethod =
      this.reflector.get<string[]>('fieldsToKeep', context.getHandler()) || [];

    // ✅ Ambil field yang opsional untuk di-hide
    const optionalHideFieldsFromClass =
      this.reflector.get<string[]>(
        'fieldsToOptionalHide',
        context.getClass(),
      ) || [];
    const optionalHideFieldsFromMethod =
      this.reflector.get<string[]>(
        'fieldsToOptionalHide',
        context.getHandler(),
      ) || [];

    // 🔹 Gabungkan semua field yang boleh tampil & tetap ada
    const fieldsToShow = [
      ...new Set([...fieldsFromClass, ...fieldsFromMethod]),
    ];
    const fieldsToKeep = [
      ...new Set([...keepFieldsFromClass, ...keepFieldsFromMethod]),
    ];

    // 🔹 Gabungkan semua field yang akan disembunyikan (Default + Optional)
    const fieldsToHide = [
      ...new Set([
        ...defaultHiddenFields,
        ...optionalHideFieldsFromClass,
        ...optionalHideFieldsFromMethod,
      ]),
    ];

    return next.handle().pipe(
      map((data) => {
        if (!data || typeof data !== 'object') return data;

        if (Array.isArray(data)) {
          return data.map((item) =>
            this.cleanObject(item, fieldsToShow, fieldsToKeep, fieldsToHide),
          );
        } else {
          return this.cleanObject(
            data,
            fieldsToShow,
            fieldsToKeep,
            fieldsToHide,
          );
        }
      }),
    );
  }

  private cleanObject(
    obj: any,
    fieldsToShow: string[],
    fieldsToKeep: string[],
    fieldsToHide: string[],
  ) {
    const filteredData = { ...obj };

    // ❌ Hapus field yang ada dalam `fieldsToHide`, kecuali jika ada di `fieldsToShow` atau `fieldsToKeep`
    fieldsToHide.forEach((field) => {
      if (!fieldsToShow.includes(field) && !fieldsToKeep.includes(field)) {
        delete filteredData[field];
      }
    });

    return filteredData;
  }
}
