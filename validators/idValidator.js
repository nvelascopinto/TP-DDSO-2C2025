import { z } from "zod"

// export const idValidator = z.string().transform((val, ctx) => {
//   const num = Number(val)
//   if (isNaN(num) || num < 0) {
//     ctx.addIssue({
//       code: "INVALID_ID",
//       message: "id must be a positive number",
//     })
//     return z.NEVER
//   }
//   return num
// })

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