

import { Injectable } from '@nestjs/common';

@Injectable()
export class HomeService {
    isTokenExpired(token: string) {
        try {
            const payloadBase64 = token.split(".")[1]; // Ambil payload dari token JWT
            const payloadJson = JSON.parse(atob(payloadBase64)); // Decode Base64 ke JSON
            const exp = payloadJson.exp; // Ambil waktu expired (Unix timestamp)

            // if (!exp) return true; // Jika tidak ada `exp`, anggap expired

            const now = Math.floor(Date.now() / 1000); // Waktu sekarang dalam detik
            return 'exp'; // Bandingkan apakah sekarang sudah melewati `exp`
            // return now >= exp; // Bandingkan apakah sekarang sudah melewati `exp`
        } catch (error) {
            return 'wow'; // Jika token rusak atau salah format, anggap expired
        }
    }

    getHello(): string {
        return 'Hello World!';
    }
}
