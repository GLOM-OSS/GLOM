export const sAUTH403 = {
  en: `Your session is invalid. Please login!`,
  fr: 'Votre session est non valide. Veuillez vous connecter !',
};
export const AUTH01 = {
  en: `Your google access token or email has been invalidated`,
  fr: `Votre jeton d'accès à Google ou votre adresse électronique a été invalidée.`,
};
export const AUTH02 = {
  en: `Sorry, your have more than two session open. Consider closing them all.`,
  fr: `Désolé, vous avez plus de deux sessions ouvertes. Pensez à tous les fermer.`,
};
export const AUTH03 = (message: string) => ({
  en: `Your login request failed with error: ${message}`,
  fr: 'La demande de connexion a échoué avec une erreur :',
});
export const AUTH05 = {
  en: `Your access or your Squoolr client is invalid`,
  fr: `Votre accès ou votre client Squoolr est non valide`,
};
export const AUTH04 = {
  en: `Oops, you've recently triggered this action. Please try later`,
  fr: 'Oups, vous avez récemment déclenché cette action. Veuillez essayer plus tard',
};
export const AUTH06 = (message: string) => ({
  en: `Log out error ${message}`,
  fr: `Erreur de deconnexion ${message}`,
});
export const AUTH07 = {
  en: `Please, provide the right credentials`,
  fr: `S'il vous plaît, fournissez les bonnes références`,
};
export const AUTH08 = {
  en: `Oops, you have an ongoing subscription. Try later`,
  fr: 'Oups, vous avez un abonnement en cours. Essayez plus tard',
};
export const AUTH400 = {
  en: `Bad Request. Invalid grant`,
  fr: 'Mauvaise demande. Subvention non valide',
};
export const AUTH401 = {
  en: `Incorrect email or password.`,
  fr: 'Adresse mail ou mot de passe incorrect.',
};
export const AUTH404 = (search: string) => ({
  en: `${search} not found.`,
  fr: `${search} introuvable`,
});
export const sAUTH404 = {
  en: `Your reset password request cannot be found or has expired.`,
  fr: `Votre demande de renouvellement de mot de passe est introuvable ou a expiré.`,
};

export const AUTH403 = (ressource: string) => ({
  en: `Access borbidden for ${ressource}.`,
  fr: `Accès interdit pour ${ressource}`,
});
export const AUTH500 = {
  en: `Sorry, we could not destroy your session`,
  fr: `Désolé, nous avons pas pu deruire votre session`,
};
export const AUTH501 = (element: string) => ({
  en: `Sorry, <${element}> is not yet implemented`,
  fr: `Désolé, <${element}> n'est pas encore implémenté.`,
});
export const AUTH503 = {
  en: `Sorry, this action cannot be processed now. Consider trying later or with another account`,
  fr: 'Désolé, cette action ne peut être traitée maintenant. Essayez plus tard ou avec un autre compte',
};

export const ERR01 = {
  en: `You most provide one and only one of the optional attributes`,
  fr: `Vous ne pouvez fournir qu'un et qu'un seul des attributs facultatifs`,
};
export const ERR02 = {
  en: `Invalid school demand identifier`,
  fr: `Identifiant de la demande non valide`,
};
export const ERR03 = (element: string) => ({
  en: `Unique contraints: This element(${element}) already exits`,
  fr: `Contrainte d'unicité: Cette element(${element}) existe déjà`,
});
export const ERR04 = {
  en: `The number of classes in a specialty cannot differ from the number of years available in its curriculum.`,
  fr: `Le nombre de classes dans une spécialité ne peut différer du nombre d'années disponibles dans son cursus.`,
};
export const ERR05 = {
  en: `The start date of an academic year cannot be later than the end date`,
  fr: `La date de début d'une année académique ne peut être postérieure à la date de fin.`,
};
export const ERR06 = {
  en: `Sorry, there is an overlap of academic years`,
  fr: `Désolé, Il y a chevauchement des annees academiques`,
};
export const ERR07 = {
  en: `Sorry, you can only create UE or UV in the fields you belong to.`,
  fr: `Désolé, vous ne pouvez creer d'UE ou D'UV que dans les filières auxquelles vous appartenez`,
};
export const ERR08 = {
  en: `Semester number cannot be greater than it cycle total number of semester.`,
  fr: `Le numéro de semestre ne peut etre plus superieur au nombre total de semestres de son cycle.`,
};
export const ERR09 = {
  en: `Sorry, overlapping values where detected.`,
  fr: `Désolé, des chauvechements de valeur ont été détecté.`,
};
export const ERR10 = {
  en: `Sorry, module total weight should equals 1.`,
  fr: `Désolé, le poids total d'un module doit être 1.`,
};
export const ERR11 = {
  en: `Please either use the evaluation id or subject and evaluation sub type id to fetch evaluation data.`,
  fr: `Veuillez utiliser soit l'identifiant de l'évaluation, soit l'identifiant du sujet et du sous-type d'évaluation pour récupérer les données d'évaluation.`,
};
export const ERR12 = {
  en: `Sorry you cannot access student's anonymities once they are anonimated.`,
  fr: `Désolé, vous ne pouvez pas acceder aux anomimats des etudiants une fois qu'ils sont anonimés.`,
};
export const ERR13 = {
  en: `Sorry, some evaluations identifier are incorrect.`,
  fr: `Désolé, Certains identifiants d'evaluations sont incorrect.`,
};
export const ERR14 = {
  en: `Sorry, this action requires valid private code`,
  fr: `Désolé, Cette action neccessite un code privée valide.`,
};
export const ERR15 = {
  en: `Sorry, you can't anonimated a resit evaluation with unknown examination date`,
  fr: `Désolé, vous ne pouvez pas anonimer un examin de rattrapage dont la date est inconnue.`,
};
export const ERR16 = {
  en: `Sorry, you can't published an exam that isn't anonimated`,
  fr: `Désolé, vous ne pouvez pas publier un examin qui n'a pas été anonimé.`,
};
export const ERR17 = (ext: string) => ({
  en: `Sorry, ${ext} is not supported`,
  fr: `Désolé, ${ext} n'est pas une extendion supportée.`,
});
export const ERR18 = {
  en: `Sorry, you can't publish assessment marks before examination is passed.`,
  fr: `Désolé, vous ne pouvez pas publier les notes d'évaluation avant que l'examen ne soit passé.`,
};
export const ERR19 = (
  value: string | number | boolean,
  expectedValue: string | number | boolean
) => ({
  en: `Provided data are wrong. Expecting ${expectedValue}, found ${value}`,
  fr: `Les données fournies sont erronées. On attendait ${expectedValue},  on a trouvé ${value}`,
});
export const ERR20 = (element: string) => ({
  en: `${element} input is required`,
  fr: `la donnee '${element}' est requise`,
});
export const ERR21 = {
  en: `This assessment hall access is closed`,
  fr: `La salle d'accès à cette examen est fermée`,
};
export const ERR22 = {
  en: `Structural questions require an answer, while File question require a file`,
  fr: `Les questions structurelles nécessitent une réponse, tandis que les questions relatives aux fichiers nécessitent un fichier.`,
};
export const ERR23 = {
  en: `Group assignments can't have duration.`,
  fr: `Les devoirs de group ne peuvent pas avoir de durée.`,
};
export const ERR24 = {
  en: `The question type does not match with the answer value`,
  fr: `Le type de question ne correspond pas à la valeur de la réponse`,
};
export const ERR25 = {
  en: `Sorry, you can only submit ones`,
  fr: `Désolé, vous pouvez soumettre qu'une seule fois.`,
};
export const ERR26 = {
  en: `Sorry, only group assignments support file type questions.`,
  fr: `Désolé, seules les devoirs de groupe prennent en charge les questions de type fichier.`,
};
export const ERR27 = {
  en: `Access denied. group's submission details can only be seen by group members`,
  fr: `Accès refusé. Les détails de soumission du groupe ne peuvent être vus que par les membres du groupe.`,
};
export const ERR28 = {
  en: `Sorry, only group assignments can be corrected with a group code and annual student IDs are required for individual assessments only.`,
  fr: `Désolé, seuls les devoirs de groupe peuvent être corrigés avec un code de groupe et les identifiants annuels des étudiants sont requis pour les évaluations individuelles uniquement.`,
};
export const ERR29 = {
  en: `Sorry, all student must approve before corrections are made.`,
  fr: `Désolé, tous les étudiants doivent approuver avant que les corrections ne soient faites.`,
};
export const ERR30 = {
  en: `Sorry, a published assessment or assignment can't be modified.`,
  fr: `Désolé, une évaluation ou un devoir publié ne peut être modifier`,
};
export const ERR31 = {
  en: `Sorry, you can't submit after approval.`,
  fr: `Désolé, vous ne pouvez soumettre apres approbation.`,
};
