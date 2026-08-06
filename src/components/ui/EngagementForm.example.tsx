/**
 * Exemple d'utilisation du composant EngagementForm
 * 
 * Ce fichier montre comment intégrer le composant dans votre application.
 */

import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { EngagementForm } from './EngagementForm';

/**
 * Exemple 1: Utilisation basique avec gestion d'état local
 */
export function BasicEngagementExample() {
  const handleAccept = () => {
    console.log('Charte acceptée');
    // Logique pour continuer le processus d'inscription
  };

  const handleCancel = () => {
    console.log('Annulation');
    // Logique pour annuler ou revenir en arrière
  };

  return (
    <EngagementForm
      studentName="Jean Dupont"
      onAccept={handleAccept}
      onCancel={handleCancel}
    />
  );
}

/**
 * Exemple 2: Utilisation avec contrôle externe
 */
export function ControlledEngagementExample() {
  const [accepted, setAccepted] = useState(false);

  const handleAccept = () => {
    setAccepted(true);
    // Logique pour continuer le processus d'inscription
  };

  const handleCancel = () => {
    setAccepted(false);
    // Logique pour annuler
  };

  return (
    <EngagementForm
      studentName="Jean Dupont"
      accepted={accepted}
      controlled={true}
      onAccept={handleAccept}
      onCancel={handleCancel}
    />
  );
}

/**
 * Exemple 3: Utilisation dans un formulaire existant
 */
export function FormIntegrationExample() {
  const { watch } = useFormContext();
  const nom = watch('Nom');
  const prenom = watch('Prenom');
  const studentName = `${prenom} ${nom}`.trim();

  const handleAccept = () => {
    // Continuer vers l'étape suivante
    // Remplacez cette fonction par votre logique de navigation
    console.log('Navigation vers l\'étape suivante');
  };

  return (
    <EngagementForm
      studentName={studentName}
      onAccept={handleAccept}
      acceptButtonText="Valider mon inscription"
      cancelButtonText="Retour"
    />
  );
}

/**
 * Exemple 4: Contenu personnalisé
 */
export function CustomContentExample() {
  const customContent = (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Règlement intérieur</h3>
      <p>Votre contenu personnalisé ici...</p>
    </div>
  );

  return (
    <EngagementForm
      title="Règlement intérieur"
      subtitle="Veuillez lire attentivement le règlement suivant"
      content={customContent}
      onAccept={() => console.log('Accepté')}
    />
  );
}