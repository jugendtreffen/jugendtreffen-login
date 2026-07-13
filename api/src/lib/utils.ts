export function getAge(birthDate: Date, cutoffDate = new Date()): number {
  let age = cutoffDate.getFullYear() - birthDate.getFullYear();

  const monthDiff = cutoffDate.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && cutoffDate.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
}
