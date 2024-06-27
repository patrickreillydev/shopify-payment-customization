import type {
  RunInput,
  FunctionRunResult,
} from "../generated/api";

const NO_CHANGES: FunctionRunResult = {
  operations: [],
};

/**
 * 
 * Hard coded for the sake of this example 
 * but would store in a metafield on the paymentCustomization type via the graphQL api. 
 * Both the payment type and the amount of products to hide it.
 *
 */
const HIDE_PAYMENT_METHOD = 'afterpay';

interface merchandiseProductVariant {
  product: {
    metafield?: {
      value?: string
    };
  }
}
interface afterPayDeliverableCartLine {
  merchandise?: merchandiseProductVariant
}

/**
 * Check product MetaField hide_afterpay boolean status to see if afterpay is available with this purchase involved.
 * @param lines 
 * @returns 
 */
const checkIfProductIsAfterPayApproved = (lines?: afterPayDeliverableCartLine[]) => {
  if (!lines) return false
  return !!lines?.find(l => (l?.merchandise as merchandiseProductVariant)?.product?.metafield?.value === 'true')
}

export function run(input: RunInput): FunctionRunResult {

  if (!input.cart || !input?.paymentMethods) {
    return NO_CHANGES;
  }
  const lines = input?.cart?.deliverableLines as afterPayDeliverableCartLine[]
  const hidePaymentMethod = checkIfProductIsAfterPayApproved(lines)
  const paymentMethodToHide = input?.paymentMethods?.find(p => p?.name?.toLowerCase() === HIDE_PAYMENT_METHOD)
  if (hidePaymentMethod && paymentMethodToHide) {
    return {
      operations: [{
        hide: {
          paymentMethodId: paymentMethodToHide.id
        }
      }]
    }
  }

  return NO_CHANGES;
};

