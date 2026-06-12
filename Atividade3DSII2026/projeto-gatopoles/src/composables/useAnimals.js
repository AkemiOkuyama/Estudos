import { ref } from 'vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const user = ref(null);
const auth = getAuth();

onAuthStateChanged(auth, (currentUser) => {
  user.value = currentUser;
});

export function useAuth() {
  return { user };
}