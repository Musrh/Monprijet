<style scoped>
/* Boutons principaux */
.menu-btn {
  background: #16a34a;
  color: #fff;
  padding: 6px 10px;       /* réduit par rapport à avant */
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s;
  display: inline-flex;
  justify-content: center;
  min-width: 80px;         /* largeur minimale */
  max-width: 120px;        /* largeur maximale */
  text-align: center;
}

.menu-btn:hover {
  background: #15803d;
  transform: translateY(-1px);
}

/* Badge utilisateur */
.user-badge {
  background: #22c55e;
  color: #fff;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
}

/* Bouton logout */
.logout-btn {
  background: #ef4444;
  color: #fff;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 13px;
}

.logout-btn:hover { background: #dc2626; }

/* Login/Logout mobile */
.mobile-auth {
  background: #16a34a;
  padding: 2px 6px;        /* plus compact */
  border-radius: 6px;
  font-size: 12px;
}

.mobile-auth.logout { background: #ef4444; }

/* Adaptation mobile : réduire largeur boutons */
@media (max-width: 768px) {
  .menu-btn {
    width: auto;            /* largeur auto selon contenu */
    min-width: unset;
    max-width: unset;
    padding: 3px 6px;
    font-size: 12px;
    text-align: left;       /* texte aligné à gauche pour mobile */
  }

  .user-badge {
    padding: 2px 4px;
    font-size: 11px;
  }

  .logout-btn {
    padding: 2px 4px;
    font-size: 12px;
  }
}
</style>
