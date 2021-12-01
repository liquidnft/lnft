rm -rf build
pnpm build
pnpm adapt
scp -r build la:~
ssh la "rm -rf ~/la/hasura/data/raretoshi && mv build ~/la/hasura/data/raretoshi && docker restart nginx"
