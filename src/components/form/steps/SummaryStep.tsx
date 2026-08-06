import { useFormContext } from 'react-hook-form';
import { useMemo } from 'react';
import {
  Award,
  Briefcase,
  GraduationCap,
  IdCard,
  Phone,
  ShieldCheck,
  UserRound,
  Users,
} from 'lucide-react';
import { FormLayout } from '@/components/form/FormLayout';
import { SummaryCard } from '@/components/ui/SummaryCard';
import {
  NIVEAU_DIPLOME_OPTIONS,
  SITUATION_MATRIMONIALE_OPTIONS,
  SECTEUR_ACTIVITE_OPTIONS,
} from '@/constants/options';
import { getNiveauLabel } from '@/constants/niveauLabels';
import { useLevels } from '@/hooks/useLevels';
import { useCourses } from '@/hooks/useCourses';
import type { PreRegistrationFormValues, StepId } from '@/types';

const YES = 'Oui';
const NO = 'Non';

interface SummaryStepProps {
  onEditStep: (stepId: StepId) => void;
}

export function SummaryStep({ onEditStep }: SummaryStepProps) {
  const { watch } = useFormContext<PreRegistrationFormValues>();
  const values = watch();
  const levelsQuery = useLevels(values.AnneeAcademique);
  const coursesQuery = useCourses(values.AnneeAcademique);

  // Optimisation: useMemo pour ne pas recalculer les labels à chaque rendu
  const apiLevelLabel = useMemo(
    () => levelsQuery.data?.find((l) => l.Niveau === values.Niveau)?.Libelle,
    [levelsQuery.data, values.Niveau]
  );
  
  const levelLabel = useMemo(
    () => values.Niveau ? getNiveauLabel(values.Niveau, apiLevelLabel) : '',
    [values.Niveau, apiLevelLabel]
  );
  
  const courseLabel = useMemo(
    () => coursesQuery.data?.find((c) => c.IDParcours === values.IDParcours)?.NomParcours ?? values.IDParcours,
    [coursesQuery.data, values.IDParcours]
  );
  
  const situationLabel = useMemo(
    () => SITUATION_MATRIMONIALE_OPTIONS.find((o) => o.value === values.SituationMatrimoniale)?.label ?? '',
    [values.SituationMatrimoniale]
  );
  
  const secteurLabel = useMemo(
    () => SECTEUR_ACTIVITE_OPTIONS.find((o) => o.value === values.SecteurActivité)?.label ?? '',
    [values.SecteurActivité]
  );

  // Optimisation: useMemo pour les champs de diplômes
  const diplomaFields = useMemo(
    () => values.diplomas.map((d, i) => ({
      label: `Diplôme ${i + 1}`,
      value: `${d.Diplôme || '—'} (${
        NIVEAU_DIPLOME_OPTIONS.find((o) => o.value === d.NiveauDiplome)?.label ?? d.NiveauDiplome
      }) — ${d.Année}, ${d.ETS}`,
    })),
    [values.diplomas]
  );

  return (
    <FormLayout
      title="Récapitulatif"
      description="Vérifiez attentivement vos informations avant de valider votre pré-inscription."
    >
      <SummaryCard
        title="Informations personnelles"
        icon={<IdCard className="h-5 w-5" />}
        onEdit={() => onEditStep('personal')}
        fields={[
          { label: 'Matricule Bac', value: values.MatriculeBac },
          { label: 'Nom', value: values.Nom },
          { label: 'Prénom', value: values.Prenom },
          { label: 'Sexe', value: values.Sexe === 'M' ? 'Masculin' : 'Féminin' },
          { label: 'Date de naissance', value: values.DateNais },
          { label: 'Lieu de naissance', value: values.LieuNais },
          { label: 'Pays d’origine', value: values.PaysOrigine },
          { label: 'Nationalité', value: values.DésignNationalité },
        ]}
      />

      {values.Photo && (
        <div className="flex items-center gap-4 rounded-2xl border border-slate-100 dark:border-dark-border bg-white dark:bg-dark-card p-4 shadow-soft dark:shadow-soft-dark transition-colors duration-300">
          <img src={values.Photo} alt="Photo d'identité" className="h-16 w-16 rounded-xl object-cover" />
          <p className="text-sm text-ink-soft/70 dark:text-dark-text-secondary/70 transition-colors duration-300">Photo d’identité jointe.</p>
        </div>
      )}

      <SummaryCard
        title="Coordonnées"
        icon={<Phone className="h-5 w-5" />}
        onEdit={() => onEditStep('contact')}
        fields={[
          { label: 'Téléphone', value: values.Téléphone1 },
          { label: 'Téléphone secondaire', value: values.Téléphone2 },
          { label: 'E-mail', value: values.Email },
          { label: 'Adresse', value: values.Adresse },
          { label: 'Quartier', value: values.Quartier },
        ]}
      />

      <SummaryCard
        title="Situation familiale"
        icon={<Users className="h-5 w-5" />}
        onEdit={() => onEditStep('family')}
        fields={[
          { label: 'Situation matrimoniale', value: situationLabel },
          { label: 'Orphelin de père', value: values.OrphelinPère ? YES : NO },
          { label: 'Orpheline de mère', value: values.OrphelinMère ? YES : NO },
          { label: 'Autochtone', value: values.Autochtone ? YES : NO },
          { label: 'Handicapé', value: values.Handicapé ? YES : NO },
          { label: 'Boursier', value: values.Boursier ? YES : NO },
        ]}
      />

      <SummaryCard
        title="Informations professionnelles"
        icon={<Briefcase className="h-5 w-5" />}
        onEdit={() => onEditStep('professional')}
        fields={[
          { label: 'Secteur d’activité', value: secteurLabel },
          { label: 'Expérience professionnelle', value: values.ExpérienceProf ? YES : NO },
          { label: 'Fonction actuelle', value: values.FonctionActuelle },
          { label: 'Structure de travail', value: values.StructureTravail },
        ]}
      />

      <SummaryCard
        title="Parents"
        icon={<UserRound className="h-5 w-5" />}
        onEdit={() => onEditStep('parents')}
        fields={[
          { label: 'Père', value: values.NomPrenomPère },
          { label: 'Téléphone père', value: values.TéléphonePère },
          { label: 'Mère', value: values.NomPrenomMère },
          { label: 'Téléphone mère', value: values.TéléphoneMère },
        ]}
      />

      <SummaryCard
        title="Tuteur"
        icon={<ShieldCheck className="h-5 w-5" />}
        onEdit={() => onEditStep('guardian')}
        fields={[
          { label: 'Nom du tuteur', value: values.NomPrénomTuteur },
          { label: 'Relation', value: values.RelationAvecTuteur },
          { label: 'Téléphone', value: values.TéléphoneTuteur },
        ]}
      />

      <SummaryCard
        title="Choix académiques"
        icon={<GraduationCap className="h-5 w-5" />}
        onEdit={() => onEditStep('academic')}
        fields={[
          { label: 'Année académique', value: values.AnneeAcademique },
          { label: 'Niveau', value: levelLabel },
          { label: 'Parcours', value: courseLabel },
        ]}
      />

      <SummaryCard
        title="Diplômes"
        icon={<Award className="h-5 w-5" />}
        onEdit={() => onEditStep('diplomas')}
        fields={diplomaFields}
      />
    </FormLayout>
  );
}
