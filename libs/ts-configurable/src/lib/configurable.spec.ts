import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { Configurable } from './configurable';

/**
 * Keep test spec specific environment variable and command line argument prefixes to avoid collisions during parallel execution
 * Each it-block has a prefix (a, b, c, ...) as well to avoid collisions inside one test spec file
 * Prefixes for this spec: spec_configurable_
 */
describe('libs/config: @Configurable() decorator', () => {
  type TOrder = Partial<{
    recipient: string;
    priceTotal: number;
    delivered: boolean;
    billing: Partial<{ address: string }>;
  }>;

  class BasePizzaConfig {
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

  it('Configurable decorator is applicable', () => {
    expect(() => {
      @Configurable()
      class PizzaConfig extends BasePizzaConfig {}
    }).not.toThrow();
  });

  it('All properties are read-only with enforceReadonly=true ', () => {
    // Create a new configuration class
    @Configurable({ enforceReadonly: true })
    class PizzaConfig extends BasePizzaConfig {}
    const config = new PizzaConfig();

    // Expect modifications to fail
    expect(() => {
      config.id = 3;
    }).toThrow();
    expect(() => {
      config.topping = 'ham';
    }).toThrow();
    expect(() => {
      config.ingredients = [];
    }).toThrow();
    expect(() => {
      config.order.billing.address = 'Jerkstreet 52a, 1234 Whatevertown';
    }).toThrow();
    expect(() => {
      config.ingredients.push('sardine');
    }).toThrow();
    expect(() => {
      config.ingredients.pop();
    }).toThrow();
    expect(() => {
      delete config.order.recipient;
    }).toThrow();

    // Check if config was not modified
    expect(config).toStrictEqual(new PizzaConfig());
  });

  it('All properties are modifyable with enforceReadonly=false ', () => {
    // Create a new configuration class
    @Configurable({ enforceReadonly: false, parseEnv: false, parseArgv: false })
    class PizzaConfig extends BasePizzaConfig {}
    const config = new PizzaConfig();

    // Expect modifications to fail
    expect(() => {
      config.id = 3;
    }).not.toThrow();
    expect(() => {
      config.topping = 'ham';
    }).not.toThrow();
    expect(() => {
      config.rating = '5 stars';
    }).not.toThrow();
    expect(() => {
      config.ingredients = [];
    }).not.toThrow();
    expect(() => {
      config.order.billing.address = 'Jerkstreet 52a, 1234 Whatevertown';
    }).not.toThrow();
    expect(() => {
      config.ingredients.push('sardine');
    }).not.toThrow();
    expect(() => {
      config.ingredients.pop();
    }).not.toThrow();
    expect(() => {
      delete config.order.recipient;
    }).not.toThrow();

    // Check if config was modified correctly
    expect(config).toEqual({
      id: 3,
      topping: 'ham',
      rating: '5 stars',
      ingredients: [],
      order: {
        priceTotal: 6.2,
        delivered: true,
        billing: {
          address: 'Jerkstreet 52a, 1234 Whatevertown',
        },
      },
    });
  });

  it('Assignments of values with wrong types throw on strictTypeChecking=true ', () => {
    // Check for properties of type 'number'
    @Configurable({
      strictTypeChecking: true,
      parseEnv: {
        separator: '__',
        lowerCase: false,
        prefix: 'spec_configurable_a_',
      },
    })
    class PizzaConfig {
      id = 5;
    }

    expect(() => {
      process.env.spec_configurable_a_id = 'number_1';
      const config = new PizzaConfig();
    }).toThrow();

    // Check for properties of type 'boolean'
    @Configurable({
      strictTypeChecking: true,
      parseEnv: {
        separator: '__',
        lowerCase: false,
        prefix: 'spec_configurable_b_',
      },
    })
    class PizzaConfig2 {
      order = {
        delivered: true,
      };
    }

    expect(() => {
      process.env.spec_configurable_b_order__delivered = '1';
      const config = new PizzaConfig2();
    }).toThrow();

    // Check for properties of type 'string'
    @Configurable({
      strictTypeChecking: true,
      parseEnv: {
        separator: '__',
        lowerCase: false,
        prefix: 'spec_configurable_c_',
      },
      parseValues: true,
    })
    class PizzaConfig3 {
      topping = 'ham';
    }

    expect(() => {
      process.env.spec_configurable_c_topping = 'false';
      const config = new PizzaConfig3();
    }).toThrow();
  });

  it('Throw an error when overriding non-primitive properties with primitive ones or vice versa on strictObjectStructureChecking=true', () => {
    // Override non-primitive property with primitive type
    @Configurable({
      strictTypeChecking: false,
      strictObjectStructureChecking: true,
      parseEnv: {
        separator: '__',
        lowerCase: false,
        prefix: 'spec_configurable_d_',
      },
      parseValues: true,
    })
    class PizzaConfig extends BasePizzaConfig {}

    expect(() => {
      process.env.spec_configurable_d_order = 'One pizza margherita please.';
      const config = new PizzaConfig();
    }).toThrow();

    // Override primitive property with non-primitive type
    @Configurable({
      strictTypeChecking: false,
      strictObjectStructureChecking: true,
      parseEnv: {
        separator: '__',
        lowerCase: false,
        prefix: 'spec_configurable_e_',
      },
      parseValues: true,
    })
    class PizzaConfig2 extends BasePizzaConfig {}

    expect(() => {
      process.env.spec_configurable_e_topping = '["bacon", "eggs"]';
      const config = new PizzaConfig2();
    }).toThrow();

    // Override array property with non-array type
    @Configurable({
      strictTypeChecking: false,
      strictObjectStructureChecking: true,
      parseEnv: {
        separator: '__',
        lowerCase: false,
        prefix: 'spec_configurable_f_',
      },
      parseValues: true,
    })
    class PizzaConfig3 extends BasePizzaConfig {}

    expect(() => {
      process.env.spec_configurable_f_ingredients = 'oil and bread and cheese';
      const config = new PizzaConfig3();
    }).toThrow();

    // Override null property with non-primitve type
    @Configurable({
      strictTypeChecking: false,
      strictObjectStructureChecking: true,
      parseEnv: {
        separator: '__',
        lowerCase: false,
        prefix: 'spec_configurable_g_',
      },
      parseValues: true,
    })
    class PizzaConfig4 extends BasePizzaConfig {}

    expect(() => {
      process.env.spec_configurable_g_rating = '["excellent", "just ok"]';
      const config = new PizzaConfig4();
    }).toThrow();
  });

  it('Do not throw an error when overriding non-primitive properties with primitive ones or vice versa on strictObjectStructureChecking=false', () => {
    // Override non-primitive property with primitive type
    @Configurable({
      strictTypeChecking: false,
      strictObjectStructureChecking: false,
      parseEnv: {
        separator: '__',
        lowerCase: false,
        prefix: 'spec_configurable_d_',
      },
      parseValues: true,
    })
    class PizzaConfig extends BasePizzaConfig {}

    expect(() => {
      process.env.spec_configurable_d_order = 'One pizza margherita please.';
      const config = new PizzaConfig();
    }).not.toThrow();

    // Override primitive property with non-primitive type
    @Configurable({
      strictTypeChecking: false,
      strictObjectStructureChecking: false,
      parseEnv: {
        separator: '__',
        lowerCase: false,
        prefix: 'spec_configurable_e_',
      },
      parseValues: true,
    })
    class PizzaConfig2 extends BasePizzaConfig {}

    expect(() => {
      process.env.spec_configurable_e_topping = '["bacon", "eggs"]';
      const config = new PizzaConfig2();
    }).not.toThrow();

    // Override array property with non-array type
    @Configurable({
      strictTypeChecking: false,
      strictObjectStructureChecking: false,
      parseEnv: {
        separator: '__',
        lowerCase: false,
        prefix: 'spec_configurable_f_',
      },
      parseValues: true,
    })
    class PizzaConfig3 extends BasePizzaConfig {}

    expect(() => {
      process.env.spec_configurable_f_ingredients = 'oil and bread and cheese';
      const config = new PizzaConfig3();
    }).not.toThrow();

    // Override null property with non-primitve type
    @Configurable({
      strictTypeChecking: false,
      strictObjectStructureChecking: false,
      parseEnv: {
        separator: '__',
        lowerCase: false,
        prefix: 'spec_configurable_g_',
      },
      parseValues: true,
    })
    class PizzaConfig4 extends BasePizzaConfig {}

    expect(() => {
      process.env.spec_configurable_g_rating = '["excellent", "just ok"]';
      const config = new PizzaConfig4();
    }).not.toThrow();
  });

  it('Command line arguments are parsed & applied', () => {
    @Configurable({
      parseEnv: false,
      parseArgv: { prefix: 'spec_configurable_a:' },
      parseValues: true,
    })
    class PizzaConfig extends BasePizzaConfig {}

    process.argv.push('--spec_configurable_a:id=2');
    process.argv.push('--spec_configurable_a:topping=bacon');
    process.argv.push('--spec_configurable_a:rating=5');
    process.argv.push('--spec_configurable_a:order.recipient=Jonny');

    const config = new PizzaConfig();

    // Check if config was modified correctly
    expect(config).toEqual({
      id: 2,
      topping: 'bacon',
      rating: 5,
      ingredients: ['tomato', 'bread'],
      order: {
        priceTotal: 6.2,
        recipient: 'Jonny',
        delivered: true,
        billing: {
          address: 'Jerkstreet 53a, 1234 Whatevertown',
        },
      },
    });
  });

  it('Set calculated values for class property defaults', () => {
    @Configurable()
    class PizzaConfig extends BasePizzaConfig {
      rating = '5 stars';
      summary = `${this.topping} pizza (${this.rating})`;
    }
    const config = new PizzaConfig();
    expect(config.summary).toBe('cheese pizza (5 stars)');
  });

  it('Set property values in constructor', () => {
    @Configurable()
    class PizzaConfig extends BasePizzaConfig {
      constructor() {
        super();
        this.id = 23;
      }
    }
    const config = new PizzaConfig();
    expect(config.id).toBe(23);
  });

  it('Load environment variables from file', () => {
    // Create temporary environment variables file
    const envFilepath = path.join(os.tmpdir(), '.env');
    fs.writeFileSync(
      envFilepath,
      'spec_configurable_h_id=2\nspec_configurable_h_order__delivered=false'
    );

    @Configurable({
      strictTypeChecking: true,
      parseEnv: {
        separator: '__',
        lowerCase: false,
        prefix: 'spec_configurable_h_',
      },
      parseValues: true,
      loadEnvFromFile: { path: envFilepath },
    })
    class PizzaConfig extends BasePizzaConfig {}
    const config = new PizzaConfig();

    // Delete temporary environment variables file again
    fs.unlinkSync(envFilepath);

    expect(config.id).toBe(2);
    expect(config.order.delivered).toBe(false);
  });

  it('Ignore environment variables from file if loadEnvFromFile = false', () => {
    // Create temporary environment variables file
    const envFilepath = path.join(os.tmpdir(), '.env2');
    fs.writeFileSync(
      envFilepath,
      'spec_configurable_i_id=2\nspec_configurable_i_order__delivered=false'
    );

    @Configurable({
      strictTypeChecking: true,
      parseEnv: {
        separator: '__',
        lowerCase: false,
        prefix: 'spec_configurable_i_',
      },
      parseValues: true,
      loadEnvFromFile: false,
    })
    class PizzaConfig extends BasePizzaConfig {}
    const config = new PizzaConfig();

    // Delete temporary environment variables file again
    fs.unlinkSync(envFilepath);

    expect(config.id).toBe(5);
    expect(config.order.delivered).toBe(true);
  });

  it('Detect properties that are configuration class themselves correctly as type "object" ', () => {
    class OrderConfig {
      delivered = false;
    }

    @Configurable()
    class PizzaConfig {
      id = 1;
      order = new OrderConfig();
    }

    expect(() => {
      const _ = new PizzaConfig();
    }).not.toThrow();

    const config = new PizzaConfig();
    expect(config).toEqual({
      id: 1,
      order: {
        delivered: false,
      },
    });
  });
});
