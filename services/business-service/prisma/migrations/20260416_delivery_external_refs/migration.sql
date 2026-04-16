ALTER TABLE business_order_delivery
  ADD COLUMN branch_id INT UNSIGNED NOT NULL DEFAULT 0 AFTER delivery_status,
  ADD COLUMN external_delivery_code VARCHAR(64) NULL AFTER branch_id,
  ADD COLUMN external_logistics_order_code VARCHAR(64) NULL AFTER external_delivery_code;

ALTER TABLE business_order_delivery
  ADD CONSTRAINT uq_business_order_delivery_ext_delivery_code UNIQUE (external_delivery_code),
  ADD CONSTRAINT uq_business_order_delivery_ext_logistics_order_code UNIQUE (external_logistics_order_code);

CREATE INDEX idx_business_order_delivery_branch
  ON business_order_delivery (branch_id);
