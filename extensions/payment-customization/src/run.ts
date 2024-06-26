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
const UNIQUE_PRODUCT_COUNT = 1

export function run(input: RunInput): FunctionRunResult {
  const hidePaymentMethod = input.cart.deliverableLines.length > UNIQUE_PRODUCT_COUNT
  const paymentMethodToHide = input.paymentMethods.find(p => p?.name?.toLowerCase() === HIDE_PAYMENT_METHOD)
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

