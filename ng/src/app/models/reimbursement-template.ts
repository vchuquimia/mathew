import { Reimbursement } from '@/models/reimbursement';
import { FixedAmountReimbursement } from '@/models/fixed-amount-reimbursement';

export class ReimbursementTemplate {
    reimbursements!: Reimbursement[];
    fixedAmountReimbursement!: FixedAmountReimbursement;
}
