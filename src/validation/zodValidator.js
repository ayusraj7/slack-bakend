import { StatusCodes } from "http-status-codes";
import { ZodError } from "zod";
import { customErrorResponse } from "../utils/common/responseObjects.js";

export const validate = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (err) {
      console.error("Validation error in zod validator:", err);

      let explanation = [];

      // ✅ Check if it's a ZodError
      if (err instanceof ZodError) {
        explanation = err.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        }));
      } else {
        // For non-Zod errors
        explanation = [{ field: "unknown", message: err.message || "Validation failed" }];
      }

      return res.status(StatusCodes.BAD_REQUEST).json(
        customErrorResponse({
          message: "Validation Error",
          explanation,
        })
      );
    }
  };
};
