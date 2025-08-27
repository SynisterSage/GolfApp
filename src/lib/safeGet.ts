export function getCourseImage(obj: any): string {
  if (!obj || typeof obj !== "object") return "";
  const a = obj as any;
  const v = a?.courseImage ?? a?.courseimage ?? a?.course_image ?? "";
  return typeof v === "string" ? v : "";
}