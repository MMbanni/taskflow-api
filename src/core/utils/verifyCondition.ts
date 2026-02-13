export function verifyExists<T>( value: T | null | undefined, error: Error ) : asserts value is T {
    if (value == null) {
    throw error
  }
}

export function verifyTrue( condition: boolean, error: Error) : asserts condition is true  {
    if (!condition) {
    throw error;
  }
}
