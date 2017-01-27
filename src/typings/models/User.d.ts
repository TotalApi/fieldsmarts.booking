declare type TUserRole = 'Admin' | 'SalesConsultant' | 'FranchisePartner';

interface User {
    userName: string;
    role: TUserRole;
}
