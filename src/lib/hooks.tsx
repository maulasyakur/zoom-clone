import type { Meeting } from "@/Columns";
import {
  useState,
  useEffect,
  createContext,
  useContext,
  type ReactNode,
} from "react";

type SetValue<T> = (value: T | ((val: T) => T)) => void;

/**
 * A custom hook that manages state synced with localStorage
 * @param key - The localStorage key
 * @param initialValue - The initial value if nothing is stored
 * @returns [storedValue, setValue] - The stored value and a function to update it
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, SetValue<T>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item =
        typeof window !== "undefined" ? window.localStorage.getItem(key) : null;
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue: SetValue<T> = (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);

      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Sync state across tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          setStoredValue(JSON.parse(e.newValue) as T);
        } catch (error) {
          console.warn(`Error syncing localStorage key "${key}":`, error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key]);

  return [storedValue, setValue];
}

// Meeting Context
interface MeetingContextType {
  meetings: Meeting[];
  addMeeting: (meeting: Meeting) => void;
  removeMeeting: (meetingId: string) => void;
  removeMeetings: (meetingIds: string[]) => void;
  clearMeetings: () => void;
  updateMeeting: (meetingId: string, updates: any) => void;
}

const MeetingContext = createContext<MeetingContextType | undefined>(undefined);

// Meeting Provider Component
export function MeetingProvider({ children }: { children: ReactNode }) {
  const [meetings, setMeetings] = useLocalStorage<Meeting[]>("meetings", []);

  const addMeeting = (meeting: Meeting) => {
    setMeetings((prev) => [...prev, meeting]);
  };

  const removeMeeting = (meetingId: string) => {
    setMeetings((prev) => prev.filter((m) => m.id !== meetingId));
  };

  // convenience helper for deleting multiple meetings in one state update
  const removeMeetings = (meetingIds: string[]) => {
    setMeetings((prev) => prev.filter((m) => !meetingIds.includes(m.id)));
  };

  const clearMeetings = () => {
    setMeetings([]);
  };

  const updateMeeting = (meetingId: string, updates: any) => {
    setMeetings((prev) =>
      prev.map((m) => (m.id === meetingId ? { ...m, ...updates } : m)),
    );
  };

  return (
    <MeetingContext.Provider
      value={{
        meetings,
        addMeeting,
        removeMeeting,
        removeMeetings,
        clearMeetings,
        updateMeeting,
      }}
    >
      {children}
    </MeetingContext.Provider>
  );
}

// Hook to use meeting context
export function useMeetings() {
  const context = useContext(MeetingContext);
  if (context === undefined) {
    throw new Error("useMeetingContext must be used within MeetingProvider");
  }
  return context;
}
