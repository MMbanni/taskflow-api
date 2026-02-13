export function errorLogger(err:unknown, context?: string): void {
  if(err instanceof Error) {
    console.error(
        context? `${context}: ${err.message}` : err.message
    );
        
  } else {
    console.error(
        context ?? "Unknown error:", err
    );    
  }
}