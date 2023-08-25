import { NativeModules, Platform } from 'react-native'

const Strings = [
  {
    visibleRegistry: 'Visible in Registry',
    edit: 'Edit',
    enableNotifications: 'Enable Notifications',
    sealedTopics: 'Sealed Topics',
    colorMode: 'Color Mode',
    hourMode: 'Hour Format',
    language: 'Language',
    logout: 'Logout',
    changeLogin: 'Change Login',
    deleteAccount: 'Delete Account',
    contacts: 'Contacts',
    topics: 'Topics',
    messages: 'Messages',
    support: 'Support',
    blocked: 'Blocked',
    account: 'Account',
    display: 'Display',
    messaging: 'Messaging',
  },
  {
    visibleRegistry: 'Visible dans le Registre',
    edit: 'Modifier',
    enableNotifications: 'Activer les Notifications',
    sealedTopics: 'Sujets Sécurisés',
    colorMode: 'Mode de Couleur',
    hourMode: 'Format d\'Heure',
    language: 'Langue',
    logout: 'Se Déconnecter',
    changeLogin: 'Changer le Mot de Passe',
    deleteAccount: 'Supprimer le Compte',
    contacts: 'Contacts',
    topics: 'Sujets',
    messages: 'Messages',
    support: 'Aide',
    blocked: 'Supprimé',
    account: 'Compte',
    display: 'Écran',
    messaging: 'Messagerie',
  },
  {
    visibleRegistry: 'Visible en el Registro',
    edit: 'Editar',
    enableNotifications: 'Permitir Notificaciones',
    sealedTopics: 'Temas Protegidos',
    colorMode: 'Modo de Color',
    hourMode: 'Formato de Hora',
    language: 'Idioma',
    logout: 'Cerrar Sesión',
    changeLogin: 'Cambiar la contraseña',
    deleteAccount: 'Borrar Cuenta',
    contacts: 'Contactos',
    topics: 'Temas',
    messages: 'Mensajes',
    support: 'Ayuda',
    blocked: 'Oculto',
    account: 'Cuenta',
    display: 'Pantalla',
    messaging: 'Mensajería',
  },
  {
    visibleRegistry: 'Sichtbar in der Registrierung',
    edit: 'Bearbeiten',
    enableNotifications: 'Benachrichtigungen aktivieren',
    sealedTopics: 'Gesicherte Themen',
    colorMode: 'Farmodus',
    hourMode: 'Stundenformat',
    language: 'Sprache',
    logout: 'Ausloggen',
    changeLogin: 'Kennwort Aktualisieren',
    deleteAccount: 'Konto Löschen',
    contacts: 'Kontakte',
    topics: 'Themen',
    messages: 'Mitteilungen',
    support: 'Helfen',
    blocked: 'Versteckt',
    account: 'Konto',
    display: 'Bildschirm',
    messages: 'Nachrichtenübermittlung',
  }
];

export function getLanguageStrings() {
  const locale = Platform.OS === 'ios' ? NativeModules.SettingsManager.settings.AppleLocale || NativeModules.SettingsManager.settings.AppleLanguages[0] : NativeModules.I18nManager.localeIdentifier;

  const lang = locale.slice(0, 2) || '';

  if (lang === 'en') {
    return Strings[0];
  }
  if (lang === 'fr') {
    return Strings[1];
  }
  if (lang === 'es') {
    return Strings[2];
  }
  if (lang === 'de') {
    return Strings[3];
  }
  return Strings[0];
};
