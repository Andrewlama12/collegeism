-- Remove both single and double quotes from the beginning and end of text
UPDATE statements 
SET text = TRIM(BOTH '"' FROM TRIM(BOTH '''' FROM text))
WHERE text LIKE '"%"' OR text LIKE '''%''';
