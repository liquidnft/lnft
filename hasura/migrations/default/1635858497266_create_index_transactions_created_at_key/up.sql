CREATE  INDEX "transactions_created_at_key" on
  "public"."transactions" using btree ("created_at");
