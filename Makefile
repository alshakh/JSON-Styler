Sources=src/Styler.ts src/stringFunctions.ts
OutFile=objectStyler.js
BuildDir=build


OUTPUT_FILE=$(BuildDir)/$(OutFile)

all: $(OUTPUT_FILE)

$(OUTPUT_FILE):$(Sources)
	tsc --target es5 --out $@ $^

clean:
	rm -rf $(BuildDir)
