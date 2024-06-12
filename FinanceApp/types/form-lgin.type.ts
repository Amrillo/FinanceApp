export type FormLoginType = {  
    tokens :FormTokensType, 
    user : FormUserType 
}
export type FormTokensType = {  
    accessToken: string,
    refreshToken: string
}
export type FormUserType = {  
    name: string,
    lastName: string,
    id: number,
}