import { z } from "zod"

export const idValidator = z.string()
// .transform((val, ctx) => {
//   if (!/^[a-f\d]{24}$/i.test(val)) {
//     ctx.addIssue({
//       code: "INVALID_ID",
//       message: "id must be a valid MongoDB ObjectId",
//     });
//     return z.NEVER;
//   }
//   return val;
// });
