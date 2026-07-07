import json
from pathlib import Path
p = Path(__file__).resolve().parent / 'documentos-biblioteca.json'
text = p.read_text(encoding='utf-8')

if not text:
    raise SystemExit('Empty file')

# naive parse of file because it is JSON array of objects
# collect values for keys we care about
values = {}

obj = json.loads(text)

for entry in obj:
    for key in ('estado', 'vigencia', 'estado_documento', 'estadoDocumental'):
        value = entry.get(key)
        if value is not None:
            values[value] = values.get(value, 0) + 1

for key, count in sorted(values.items(), key=lambda item: (-item[1], item[0])):
    print(f'{key} : {count}')
print('TOTAL UNIQUE:', len(values))
