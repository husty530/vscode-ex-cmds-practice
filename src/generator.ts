

export function get_template_h(lower_snake_name: string) {
  const upper_snake_name = lower_snake_name.toUpperCase();
  let upper_camel_name = "";
  for (let word of lower_snake_name.split('_')) {
    upper_camel_name += word.charAt(0).toUpperCase() + word.substring(1);
  }
  return `
#ifndef ${upper_snake_name}_H_
#define ${upper_snake_name}_H_

class ${upper_camel_name} {
 public:
  ${upper_camel_name}();
  ~${upper_camel_name}();
};

#endif  // ${upper_snake_name}_H_
`
};
