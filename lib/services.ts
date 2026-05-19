export interface ServiceCategory {
  label: string;
  services: string[];
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    label: "Sexo Oral",
    services: [
      "Oral com preservativo",
      "Oral sem preservativo",
      "Oral até o fim (com preservativo)",
      "Oral até o fim (sem preservativo)",
      "Beijo grego (faz)",
      "Beijo grego (recebe)",
      "Beijo na boca",
    ],
  },
  {
    label: "Sexo Vaginal",
    services: [
      "Vaginal com preservativo",
      "Vaginal sem preservativo",
      "Ejaculação interna",
    ],
  },
  {
    label: "Sexo Anal",
    services: [
      "Anal (com preservativo)",
      "Anal (sem preservativo)",
    ],
  },
  {
    label: "Ejaculação",
    services: [
      "Ejaculação no corpo",
      "Ejaculação no rosto",
      "Ejaculação na boca (engole)",
    ],
  },
  {
    label: "Sexo Grupal",
    services: [
      "Dupla penetração",
      "Gangbang / orgia",
      "Dupla com outra garota",
    ],
  },
  {
    label: "Fetiches",
    services: [
      "BDSM (dominação)",
      "BDSM (submissão)",
      "Fetiche de pés",
      "Chuva dourada (dá)",
      "Chuva dourada (recebe)",
      "Fantasias / roleplay",
      "Striptease",
    ],
  },
  {
    label: "Atendimento",
    services: [
      "A domicílio",
      "Em motel",
      "Local próprio",
      "Viagem nacional",
      "Viagem internacional",
    ],
  },
  {
    label: "Público aceito",
    services: [
      "Casais",
      "Mulheres",
      "Iniciantes",
      "Acima de 60 anos",
      "Homens plus size",
    ],
  },
];

export const ALL_SERVICES = SERVICE_CATEGORIES.flatMap((c) => c.services);

export const RESTRICTION_PRESETS = [
  "Não atendo bêbados",
  "Não atendo fumantes",
  "Sem foto, sem atendimento",
  "Sem desconto",
  "Hora marcada obrigatória",
  "Programa mínimo de 1 hora",
  "Pagamento antecipado",
  "Somente com higiene",
  "Sem barganha",
  "Não atendo pelo aplicativo",
];
