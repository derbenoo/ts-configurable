/** Example using the node-ts-repo-template module */

import { Configurable, BaseConfig } from '../src';

type TOrder = Partial<{
  recipient: string;
  priceTotal: number;
  delivered: boolean;
  billing: Partial<{ address: string }>;
}>;

@Configurable()
class PizzaConfig extends BaseConfig<PizzaConfig> {
  id = 5;
  topping = 'cheese';
  rating = null;
  ingredients = ['tomato', 'bread'];
  order: TOrder = {
    recipient: 'John Doe',
    priceTotal: 6.2,
    delivered: true,
    billing: {
      address: 'Jerkstreet 53a, 1234 Whatevertown',
    },
  };
}

const pizzaConfig = new PizzaConfig({ config: { topping: 'bacon' } });
console.log(JSON.stringify(pizzaConfig, null, 2));
