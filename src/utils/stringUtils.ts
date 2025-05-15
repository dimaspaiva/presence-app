export function normalizeString(string: string): string {
  return string.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function generateRandom4Digits(): string {
  return Math.ceil(Math.random() * 10000).toString().padStart(4, '0')
}

export function generateId(): string {
  const timestamp = Date.now().toString().substring(9)
  const chunkOne = generateRandom4Digits()
  const chunkTwo = generateRandom4Digits()
  const chunkThree = generateRandom4Digits()

  return `${timestamp}-${chunkOne}-${chunkTwo}-${chunkThree}`;
}
