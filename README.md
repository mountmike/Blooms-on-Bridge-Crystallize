# Blooms on Bridge NextJS Store

A fully-working ecommerce storefront built for a Florist client with Next.js
that runs on the headless ecommerce & GraphQL based Product Information
Management service [Crystallize][5].

Other integrations include [Stripe][0] for payment handling and [SendGrid][1]
for email order confirmations with Webhooks and magic link sign in.

See here for [The Service API repo][2] which manages the backend functionality
via [Vercel serverless functions][18].

## See LIVE demo

Staging site: [Blooms on Bridge][3].

![Website that sell plants displaying them as a grid. Ecommerce created with the Crystallize NextJS boilerplate and powered by our GraphQL API](public/screenshots/bouquets.png)

## Introduction

I wanted to use this project to learn a range of new technology
(Next.js/GraphQL/Stripe API/Webooks) rather than utilise a tech stack I was
already completly comfortable with.

I decided to use Crystallize as a CSM/PIM platform because they had user
friendly portal for the florist shop, excellent developer documentation and some
great [boilerplates][4] to get started with.

### The biggest challenges included:

- Learning the Crystallize eco-system - particularly when it came to reading
  different `shapes` from the CMS with GraphQL. The boilerplate included a lot
  of the hardwork but reading and understanding the pre-existing code always
  takes some time.

- Working with the Florist's criteria to build a checkout procedure that
  included address validation, programatically suggested delivery options (only
  to specific areas) and a calendar system for delivery dates.

- Integrating and building onto [The Service API][2] which I also bootstrapped
  from a Crystallize boilerplate. This was my first time using serverless
  functions so there was an obvious learning curve.

### The most rewarding aspects:

- Seeing how quick and reponsive the site is thanks to Next.js & server-side
  rendering.
- Teaching the florist to use the CMS/PIM system, particuarly the 'blog-like'
  functionality which she can now use to showcase the weddings she does for
  clients.
- Sucessfully integrating Stripe payments into the checkout process with the
  Payment Intent API. Again, the boilerplate from Crystallize had done a lot of
  the hard yards here but it didn't work off the bat and lead to a lot of
  debugging. I found a solution however and additionally made a pull request to
  Crystallize's open source boilerplate with my code.

- Using webhooks to email confirmation/receipts to customers & new order
  notifications to the store upon a successful orders with SendGrid.

- Seeing the final version of my delivery/address search components in the
  checkout process and how they worked well to address the shop's needs.

## App Structure

### `src/pages/`

Entry pages - interpreted as separate routes by Next.js.

### `src/pages/api/`

Vercel [serverless functions][18].

### `src/page-components/`

Holds the actual component content related to entries in the `pages/` directory.

### `src/components/`

Shared React components.

### `src/shapes/`

The Crystallize system for managing `folders`, `products` & `documents`.
Contains components, styles, graphql queries and more.

### `src/ui/`

UI related components live here. Color variables and simple shared components

### `src/lib/`

Enable GraphQL and REST API communication and more for the browser client

### `public/static/`

Public resources hosted as static files

## License

Open-source and MIT license.

[0]: https://stripe.com/au
[1]: https://sendgrid.com/
[2]: https://github.com/mountmike/blooms-on-bridge-SERVICE-API
[3]: https://blooms-on-bridge-crystallize.vercel.app/
[4]: https://crystallize.com/learn/open-source/boilerplates/react-nextjs
[5]: https://crystallize.com/
[18]: https://vercel.com/docs/v2/serverless-functions/introduction
