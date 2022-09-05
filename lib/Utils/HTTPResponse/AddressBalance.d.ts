export default interface AddressBalance {
    /** base 58 string */
    address: string;
    /** montant qui à été confirmé */
    confirmed: number;
    /** montant qui n'as pas encore été confirmé */
    unconfirmed: number;
}
