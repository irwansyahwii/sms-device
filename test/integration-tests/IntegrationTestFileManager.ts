/// <reference path="../../typings/index.d.ts" />

import {FileManager} from '../../lib/FileManager';
import {assert} from 'chai';


describe('FileManager', function () {
	describe('isExist(filePath)', function(){
		it('Returns true when the file exists', function(done){
			let fileManager = new FileManager();

			fileManager.isExists(`${__dirname}/IntegrationTestFileManager.ts`).subscribe(r =>{
				assert.isTrue(r);

				done();
			});
		});
		it('Returns false when the file not exists', function(done){
			let fileManager = new FileManager();

			fileManager.isExists(`${__dirname}/NOEXISTS.ts`).subscribe(r =>{
				assert.isFalse(r);

				done();
			});
		});
	});
});