interface IFranshise {
    name: string;
    region: string;
    displayName: string;
    regionDisplayName: string;
    license: string;
    insuranceCompany: string;
    insurancePolicyNumber: string;
    address: string;
    city: string;
    province: string;
    postalCode: string;
    tel: string;
    fax: string;
    email: string;
    website: string;
    hst: string;
    qst: string;
    taxRateFederal: number;
    taxRateProvincial: number;
    rate: number;
    rateForAluminium: number;
    rateForBrick: number;
    rateForStucco: number;

    //Quebec only properties
    ccq: string;
    opq: string;
    rbq: string;

    reactivate: boolean;

    isNew: boolean;
}
