import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase';

onMounted(() => {
  onAuthStateChanged(auth, async (currentUser) => {
    if (!currentUser) return;

    const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
    if (userDoc.exists()) {
      user.value = { uid: currentUser.uid, ...userDoc.data() };
      isAdmin.value = user.value.role?.toLowerCase() === 'admin';

      if (isAdmin.value) {
        fetchUsers();
        fetchOrders();
        fetchProducts();
      }
    }
  });
});
