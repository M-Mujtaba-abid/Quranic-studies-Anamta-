import { toast } from 'sonner';
import React from 'react';

/**
 * Parses and displays Apollo/GraphQL error messages in a user-friendly Sonner toast notification.
 */
export function showErrorToast(title: string, error: any) {
  if (!error) {
    toast.error(title);
    return;
  }

  console.error('[showErrorToast] Error details:', error);

  // Extract errors from Apollo's GraphQLErrors list
  const graphQLErrors = error.graphQLErrors || [];
  let description: React.ReactNode = error.message;

  if (graphQLErrors.length > 0) {
    const mainError = graphQLErrors[0];
    const extensions = mainError.extensions;
    const originalError = extensions?.originalError || extensions?.response;

    if (originalError && originalError.message) {
      const msg = originalError.message;
      
      if (Array.isArray(msg)) {
        description = (
          <ul className="list-disc pl-4 mt-1.5 space-y-1 text-xs text-red-500/90 font-medium">
            {msg.map((m: string, i: number) => {
              // Convert e.g. "packages.3.Package description is required."
              // to "Package 4: Description is required."
              const friendly = m.replace(/^packages\.(\d+)\.(.*)/, (_, index, rest) => {
                const packageNum = parseInt(index, 10) + 1;
                // Clean up double "Package" words if they exist
                const cleanedRest = rest.replace(/^Package\s+/, '');
                const capitalizedRest = cleanedRest.charAt(0).toUpperCase() + cleanedRest.slice(1);
                return `Package ${packageNum}: ${capitalizedRest}`;
              });
              return <li key={i}>{friendly}</li>;
            })}
          </ul>
        );
      } else if (typeof msg === 'string') {
        description = msg;
      }
    }
  }

  toast.error(title, {
    description,
    duration: 6000,
  });
}
