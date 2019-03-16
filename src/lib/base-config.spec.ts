import { Configurable } from './configurable';
import { BaseConfig } from './base-config';
import { IConstructorOptions } from './interfaces';

describe('libs/config: BaseConfig class', () => {
  type TOrder = Partial<{
    recipient: string;
    priceTotal: number;
    delivered: boolean;
    billing: Partial<{ address: string }>;
  }>;

  class BasePizzaConfig extends BaseConfig<BasePizzaConfig> {
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

  it('Instantiation with empty constructor', () => {
    @Configurable({ enforceReadonly: false })
    class PizzaConfig extends BasePizzaConfig {}
    expect(() => {
      const config = new PizzaConfig();
    }).not.toThrow();
  });

  it('Assignment of values via constructor', () => {
    @Configurable({ enforceReadonly: false })
    class PizzaConfig extends BasePizzaConfig {}
    const config = new PizzaConfig({
      config: {
        id: 1,
        ingredients: ['broccoli', 'sliced onions'],
        order: {
          priceTotal: 5.4,
          delivered: false,
          billing: {
            address: 'Jerkstreet 51a, 1234 Whatevertown',
          },
        },
      },
    });

    expect(config).toEqual({
      id: 1,
      topping: 'cheese',
      rating: null,
      ingredients: ['broccoli', 'sliced onions'],
      order: {
        priceTotal: 5.4,
        recipient: 'John Doe',
        delivered: false,
        billing: {
          address: 'Jerkstreet 51a, 1234 Whatevertown',
        },
      },
    });
  });

  it('Hierarchy of sources: argv -> env -> constructor -> class defaults for config values', () => {
    @Configurable({
      parseEnv: { prefix: 'spec_base_config_a_', separator: '__' },
      parseArgv: { prefix: 'spec_base_config_a:' },
      parseValues: true,
    })
    class PizzaConfig extends BasePizzaConfig {}

    process.env.spec_base_config_a_id = '3';
    process.argv.push('--spec_base_config_a:id=4');
    process.env.spec_base_config_a_order__billing__address = 'Jerkstreet 53a, 1234 Whatevertown';

    const config = new PizzaConfig({
      config: {
        id: 2,
        order: {
          delivered: false,
          billing: {
            address: 'Jerkstreet 52a, 1234 Whatevertown',
          },
        },
      },
    });

    expect(config.id).toBe(4);
    expect(config.order.delivered).toBe(false);
    expect(config.order.billing.address).toBe('Jerkstreet 53a, 1234 Whatevertown');
  });

  it('Hierarchy of sources: constructor options -> decorator options for options object', () => {
    @Configurable({
      parseEnv: { prefix: 'spec_base_config_a_', separator: '__' },
      parseArgv: { prefix: 'spec_base_config_a:' },
      parseValues: true,
    })
    class PizzaConfig extends BasePizzaConfig {}
  });

  it('Do not parse constructor options if the BaseConfig class was not extended', () => {
    @Configurable()
    class PizzaConfig {
      id = 2;
      constructor(constructorOptions?: IConstructorOptions<PizzaConfig>) {}
    }
    const config = new PizzaConfig({ config: { id: 3 } });

    expect(config.id).toBe(2);
  });

  it.skip('Use correct constructor argument when constructor was overriden', () => {
    @Configurable()
    class PizzaConfig extends BaseConfig<PizzaConfig> {
      id = 2;
      constructor(ignore: string, constructorOptions?: IConstructorOptions<PizzaConfig>) {
        super(constructorOptions);
      }
    }
    const config = new PizzaConfig('ignore', { config: { id: 3 } });

    expect(config.id).toBe(3);
  });
});
