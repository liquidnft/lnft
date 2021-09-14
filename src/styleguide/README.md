## What is STYLE-GUIDE ?

Style-guide is our own UI components library that built on tailwind & scss mixins/variables.

The idea behind our styleguide is to 

## Instruction to add new components
1. Add a component to `/src/styleguide/components` folder
2. Add a component with all its states to `/src/routes/styleguide/index.svelte` component (this page is accessible by `/styleguide` page)
3. All base colors / sizes / fonts etc should be placed at `/src/styleguide/theme.scss` in **BASE** section 
4. All component's colors / sizes / fonts etc should be placed at `/src/styleguide/theme.scss` in **COMPONENTS** section 
5. All component's colors / sizes / fonts etc should be nested from the **base variables** if it is possible

## Advices
1. For elements visual appearance please use tailwind as much as possible. Try to avoid writing your own options like: `padding`, `margin`, `font-weight`, `position`, `flex options` etc. Instead of that please use tailwind's classnames - https://tailwindcss.com/docs

## TODO
- [ ] Move style-guide to separate repository
